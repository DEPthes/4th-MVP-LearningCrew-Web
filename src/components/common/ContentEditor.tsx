// src/components/common/ContentEditor.tsx
import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "@tiptap/extension-font-size";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import styles from "../../styles/common/Editor.module.css";
import Bold from "../../assets/Bold.svg";
import Clip from "../../assets/Clip.svg";
import { Font } from "./Font";
import { Submit } from "./Submit";

interface EditorProps {
  contentText: string;
  wholeTitle: string;
  onSubmit?: (
    title: string,
    content: string,
    attachedFiles: File[],
    attachedImages: File[]
  ) => void;

  /** ✅ 프리필 */
  initialTitle?: string;
  initialContent?: string;

  /** 선택: 로딩 표시 */
  loading?: boolean;
}

interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

export const ContentEditor = ({
  contentText,
  wholeTitle,
  onSubmit,
  initialTitle = "",
  initialContent = "",
  loading = false,
}: EditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [fontSize, setFontSize] = useState("16px");
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [isBold, setIsBold] = useState(false);

  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [attachedImages, setAttachedImages] = useState<AttachedFile[]>([]);
  const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
  const [imageFiles, setImageFiles] = useState<{ id: string; file: File }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: { class: "editor-paragraph" } },
      }),
      TextStyle,
      FontSize,
      Image,
      Placeholder.configure({
        placeholder: "질문 내용을 입력하세요.",
        emptyEditorClass: "is-editor-empty",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
    onCreate({ editor }) {
      editor.chain().focus().setFontSize(`${fontSize}`).run();
    },
    onUpdate({ editor }) {
      if (editor.isEmpty) {
        const current = editor.getAttributes("textStyle").fontSize;
        const next = current || fontSize;
        editor.chain().focus().setFontSize(next).run();
        setFontSize(next);
      }
    },
  });

  /** ---------- 프리필 ---------- */
  useEffect(() => {
    setTitle(initialTitle ?? "");
  }, [initialTitle]);

  // 🔧 setContent의 2번째 인자는 버전에 따라 타입이 다름 → 옵션 객체로 안전하게 처리
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(initialContent ?? "", { emitUpdate: false });
  }, [editor, initialContent]);

  /** ---------- 편집 상태 표시 ---------- */
  useEffect(() => {
    if (!editor) return;

    const updateFont = () =>
      setCurrentFontSize(editor.getAttributes("textStyle").fontSize || "16px");
    const updateBold = () => setIsBold(editor.isActive("bold"));

    updateFont();
    updateBold();

    editor.on("selectionUpdate", updateFont);
    editor.on("update", updateBold);

    return () => {
      editor.off("selectionUpdate", updateFont);
      editor.off("update", updateBold);
    };
  }, [editor]);

  /** ---------- 툴바 ---------- */
  const handleBoldChange = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const handleFontSizeChange = useCallback(
    (size: string) => {
      if (!editor) return;
      setFontSize(`${size}px`);
      setCurrentFontSize(`${size}px`);
      editor.chain().focus().setFontSize(`${size}px`).run();
    },
    [editor]
  );

  /** ---------- 비었는지 체크 ---------- */
  const isEditorContentEmpty = useCallback((ed: any): boolean => {
    if (!ed) return true;
    const html = ed.getHTML();
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = (temp.textContent || temp.innerText || "")
      .replace(/\s+/g, "")
      .trim();
    const hasImg = html.includes("<img");
    return text.length === 0 && !hasImg;
  }, []);

  const canSubmit = () => title.length > 0 && !isEditorContentEmpty(editor);

  /** ---------- 제출 ---------- */
  const handleSubmit = async () => {
    if (!editor || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const finalContent = editor.getHTML();
      onSubmit?.(
        title,
        finalContent,
        files.map((f) => f.file),
        imageFiles.map((f) => f.file)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /** ---------- 파일 첨부 ---------- */
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (!selected) return;

      Array.from(selected).forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          alert(
            `파일 크기가 너무 큽니다. ${file.name} 파일은 50MB 이하여야 합니다.`
          );
          return;
        }
        const id = Date.now() + Math.random().toString(36).slice(2);

        if (file.type.startsWith("image/")) {
          setAttachedImages((prev) => [
            ...prev,
            { id, name: file.name, type: file.type, size: file.size },
          ]);
          setImageFiles((prev) => [...prev, { id, file }]);
        } else {
          setAttachedFiles((prev) => [
            ...prev,
            { id, name: file.name, type: file.type, size: file.size },
          ]);
          setFiles((prev) => [...prev, { id, file }]);
        }
      });

      e.target.value = "";
    },
    []
  );

  const removeAttachedFile = useCallback((id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const removeAttachedImage = useCallback((id: string) => {
    setAttachedImages((prev) => prev.filter((f) => f.id !== id));
    setImageFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${
      ["Bytes", "KB", "MB", "GB"][i]
    }`;
  };

  if (!editor) return null;

  return (
    <div className={styles.editorContainer}>
      <div className={styles.write__title}>{wholeTitle}</div>

      <div className={styles.titleSection}>
        <label className={styles.label}>제목</label>
        <input
          type="text"
          placeholder="제목을 입력하세요."
          maxLength={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleField}
        />
      </div>

      <div className={styles.contentSection}>
        <div className={styles.topSection}>
          <div>
            <label className={styles.label}>{contentText}</label>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button
                type="button"
                onClick={handleBoldChange}
                className={styles.toolbarButton}
                style={{
                  backgroundColor: isBold ? "var(--Gray4)" : "transparent",
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
                  style={{ display: "none" }}
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

        {attachedFiles.length > 0 && (
          <div className={styles.attachedFiles}>
            <h4>첨부된 파일:</h4>
            <ul>
              {attachedFiles.map((f) => (
                <li key={f.id} className={styles.attachedFile}>
                  <span>{f.name}</span>
                  <span className={styles.fileSize}>
                    ({formatFileSize(f.size)})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachedFile(f.id)}
                    className={styles.removeFile}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {attachedImages.length > 0 && (
          <div className={styles.attachedFiles}>
            <h4>첨부된 이미지:</h4>
            <ul>
              {attachedImages.map((f) => (
                <li key={f.id} className={styles.attachedFile}>
                  <span>{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachedImage(f.id)}
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
          isSubmitting={isSubmitting || loading}
          onClick={handleSubmit}
          text={isSubmitting || loading ? "제출중..." : "완료"}
        />
      </div>
    </div>
  );
};