import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from '@tiptap/extension-font-size';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import styles from "../../styles/common/Editor.module.css";
import Bold from "../../assets/Bold.svg";
import Clip from "../../assets/Clip.svg";
import { Font } from "./Font";
import { Submit } from "./Submit";

interface EditorProps {
  contentText: string;
  wholeTitle: string;
  onSubmit?: (title: string, content: string, attachedFiles: File[], attachedImages: File[]) => void;
}

interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

export const ContentEditor = ({ contentText, wholeTitle, onSubmit }: EditorProps) => {
  const [title, setTitle] = useState("");
  const [fontSize, setFontSize] = useState('16px');
  const [currentFontSize, setCurrentFontSize] = useState('16px');
  const [isBold, setIsBold] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [attachedImages, setAttachedImages] = useState<AttachedFile[]>([]);
  const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
  const [imageFiles, setImageFiles] = useState<{ id: string; file: File }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 파일 크기 제한 (50MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  //tiptap 에디터 기본 세팅
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph',
          },
        },
      }),
      TextStyle,
      FontSize,
      Image,
      Placeholder.configure({
        placeholder: '질문 내용을 입력하세요.',
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onCreate({ editor }) {
      editor.chain().focus().setFontSize(`${fontSize}`).run();
    },
    onUpdate({ editor }) {
      if (editor.isEmpty) {
        const currentFontSize = editor.getAttributes('textStyle').fontSize;
        const newFontSize = currentFontSize || fontSize;

        editor.chain().focus().setFontSize(newFontSize).run();
        setFontSize(newFontSize);
      }

      // 에디터 내용 변경 시 이미지 추적
      updateImageFilesFromEditor(editor);
    },
  });

  // 에디터의 현재 폰트 사이즈와 bold 상태를 감지하는 useEffect
  useEffect(() => {
    if (!editor) return;

    const updateCurrentFontSize = () => {
      const attributes = editor.getAttributes('textStyle');
      const fontSize = attributes.fontSize || '16px';
      setCurrentFontSize(fontSize);
    };

    const updateIsBold = () => {
      const isBoldActive = editor.isActive('bold');
      setIsBold(isBoldActive);
    };

    // 에디터가 생성되면 초기 상태 설정
    updateCurrentFontSize();
    updateIsBold();

    // 에디터의 선택 변경을 감지
    editor.on('selectionUpdate', () => {
      updateCurrentFontSize();
      updateIsBold();
    });
    editor.on('update', () => {
      updateCurrentFontSize();
      updateIsBold();
    });

    return () => {
      editor.off('selectionUpdate', updateCurrentFontSize);
      editor.off('update', updateCurrentFontSize);
    };
  }, [editor]);

  const handleBoldChange = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const handleFontSizeChange = useCallback(
    (fontSize: string) => {
      if (!editor) return;
      setFontSize(`${fontSize}px`);
      setCurrentFontSize(`${fontSize}px`);
      editor.chain().focus().setFontSize(`${fontSize}px`).run();
    },
    [editor]
  );

  // 에디터에서 이미지를 추적하여 imageFiles 업데이트
  const updateImageFilesFromEditor = useCallback((editor: any) => {
    const images = editor.getHTML().match(/<img[^>]+src="([^"]+)"[^>]*>/g);
    const newImageFiles: { id: string; file: File }[] = [];

    if (images) {
      images.forEach((imgTag: string, index: number) => {
        const srcMatch = imgTag.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1].startsWith('data:image/')) {
          const base64Data = srcMatch[1];
          const fileId = Date.now() + index + Math.random().toString(36).substr(2, 9);

          // base64를 파일로 변환
          const byteString = atob(base64Data.split(',')[1]);
          const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          const file = new File([ab], `image_${fileId}.${mimeString.split('/')[1]}`, { type: mimeString });
          newImageFiles.push({ id: fileId, file });
        }
      });
    }

    setImageFiles(newImageFiles);
  }, []);

  // 에디터 내용이 실제로 비어있는지 확인하는 함수 (버튼 활성화용, placeholder 처리용)
  const isEditorContentEmpty = useCallback((editor: any): boolean => {
    if (!editor) return true;

    const html = editor.getHTML();

    // HTML에서 텍스트만 추출
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    // 공백 문자 제거
    const trimmedText = textContent.replace(/\s+/g, '').trim();

    // 이미지가 있는지 확인
    const hasImages = html.includes('<img');

    // 텍스트가 없고 이미지도 없으면 비어있음
    return trimmedText.length === 0 && !hasImages;
  }, []);

  const canSubmit = () => {
    if (title.length === 0) return false;
    if (isEditorContentEmpty(editor)) return false;
    return true;
  };

  //여기부터 서버 처리
  // 이미지들을 서버로 업로드하고 URL 배열을 받아오는 함수
  const uploadImagesToServer = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    const formData = new FormData();
    imageFiles.forEach((imageFile, index) => {
      formData.append(`image_${index}`, imageFile.file);
    });

    try {
      // 실제 서버 엔드포인트로 변경해야 합니다
      const response = await fetch('/api/upload-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const result = await response.json();
      return result.imageUrls; // 서버에서 반환하는 URL 배열
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      throw error;
    }
  };

  // 에디터 내용의 base64 이미지를 URL로 교체하는 함수
  // const replaceBase64WithUrls = (content: string, imageUrls: string[]): string => {
  //   let updatedContent = content;
  //   let urlIndex = 0;

  //   // base64 이미지를 URL로 교체
  //   updatedContent = updatedContent.replace(
  //     /<img[^>]+src="data:image\/[^"]+"[^>]*>/g,
  //     (match) => {
  //       if (urlIndex < imageUrls.length) {
  //         const url = imageUrls[urlIndex];
  //         urlIndex++;
  //         return match.replace(/src="data:image\/[^"]+"/, `src="${url}"`);
  //       }
  //       return match;
  //     }
  //   );

  //   return updatedContent;
  // };

  const handleSubmit = async () => {
    if (!editor || isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log('원본 에디터 내용:', editor.getHTML());
      console.log('이미지 파일들:', imageFiles);
      console.log('첨부 파일들:', files);

      let finalContent = editor.getHTML();

      // 이미지가 있는 경우 서버로 업로드
      // if (imageFiles.length > 0) {
      //   console.log('이미지 업로드 시작...');
      //   const imageUrls = await uploadImagesToServer();
      //   console.log('받은 이미지 URL들:', imageUrls);

      //   // base64를 URL로 교체
      //   finalContent = replaceBase64WithUrls(finalContent, imageUrls);
      //   console.log('URL로 교체된 최종 내용:', finalContent);
      // }

      // 최종 내용을 서버로 전송
      if (onSubmit) {
        onSubmit(title, finalContent, files.map(file => file.file), imageFiles.map(file => file.file));
      }

    } catch (error) {
      console.error('제출 중 오류 발생:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // 여기까진 서버 처리

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !editor) return;

    Array.from(files).forEach((file) => {
      // 파일 크기 체크
      if (file.size > MAX_FILE_SIZE) {
        alert(`파일 크기가 너무 큽니다. ${file.name} 파일은 50MB 이하여야 합니다.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        // 이미지 파일인 경우 에디터에 삽입 -> setImageFiles에 추가
        // const reader = new FileReader();
        // reader.onload = (e) => {
        //   const imageUrl = e.target?.result as string;
        //   editor.chain().focus().setImage({ src: imageUrl }).run();
        // };
        // reader.readAsDataURL(file);

        const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
        const newFile: AttachedFile = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
        };
        setAttachedImages(prev => [...prev, newFile]);
        setImageFiles(prev => [...prev, { id: fileId, file }]);

      } else {
        // 이미지가 아닌 파일인 경우 첨부 파일 목록에 추가
        const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
        const newFile: AttachedFile = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
        };
        setAttachedFiles(prev => [...prev, newFile]);
        setFiles(prev => [...prev, { id: fileId, file }]);
      }
    });

    // 파일 입력 초기화
    event.target.value = '';
  }, [editor]);

  const removeAttachedFile = useCallback((fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
    setFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const removeAttachedImage = useCallback((fileId: string) => {
    setAttachedImages(prev => prev.filter(file => file.id !== fileId));
    setImageFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.write__title}>{wholeTitle}</div>
      <div className={styles.titleSection}>
        <label className={styles.label}>제목</label>
        <input
          type="text"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleField}
        />
      </div>

      <div className={styles.contentSection}>
        <div className={styles.topSection}>
          <div><label className={styles.label}>{contentText}</label></div>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button
                type="button"
                onClick={handleBoldChange}
                className={styles.toolbarButton}
                style={{
                  backgroundColor: isBold ? 'var(--Gray4)' : 'transparent',
                }}
                title="굵게"
              >
                <img src={Bold} alt="Bold" />
              </button>
            </div>
            <div>
              <Font
                handleFontSizeChange={handleFontSizeChange}
                currentFontSize={currentFontSize}
              />
            </div>
            <div>
              <label className={styles.fileUploadButton}>
                <img src={Clip} alt="Clip" />
                <span>파일 첨부</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
                  multiple
                />
              </label>
            </div>
          </div>
        </div>

        <div className={styles.editorWrapper}>
          <EditorContent editor={editor} />
        </div>

        {/* 첨부 파일 목록 */}
        {attachedFiles.length > 0 && (
          <div className={styles.attachedFiles}>
            <h4>첨부된 파일:</h4>
            <ul>
              {attachedFiles.map((file) => (
                <li key={file.id} className={styles.attachedFile}>
                  <span>{file.name}</span>
                  <span className={styles.fileSize}>({formatFileSize(file.size)})</span>
                  <button
                    type="button"
                    onClick={() => removeAttachedFile(file.id)}
                    className={styles.removeFile}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* 첨부 파일 목록 */}
        {attachedImages.length > 0 && (
          <div className={styles.attachedFiles}>
            <h4>첨부된 이미지:</h4>
            <ul>
              {attachedImages.map((file) => (
                <li key={file.id} className={styles.attachedFile}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachedImage(file.id)}
                    className={styles.removeFile}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.submitSection}>
        <Submit
          canSubmit={canSubmit()}
          isSubmitting={isSubmitting}
          onClick={handleSubmit}
          text={isSubmitting ? "제출중..." : "완료"} />
      </div>
    </div>
  );
};