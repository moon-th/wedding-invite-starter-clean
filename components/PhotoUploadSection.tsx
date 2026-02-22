'use client';

import { useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif']);
const MAX_FILES_PER_UPLOAD = 5;

export default function PhotoUploadSection({ slug }: { slug: string }) {
  const [name, setName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canUseUpload = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUseUpload) {
      setError('업로드 설정이 비활성화되어 있습니다.');
      return;
    }
    if (!name.trim()) {
      setError('이름을 입력해 주세요.');
      return;
    }
    if (!files.length) {
      setError('사진 파일을 선택해 주세요.');
      return;
    }
    if (files.length > MAX_FILES_PER_UPLOAD) {
      setError(`한 번에 최대 ${MAX_FILES_PER_UPLOAD}장까지 업로드할 수 있습니다.`);
      return;
    }
    for (const file of files) {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
      const safeExt = (ext || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(safeExt)) {
        setError('jpg, jpeg, png, webp, avif 파일만 업로드할 수 있습니다.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('파일 크기는 10MB 이하만 가능합니다.');
        return;
      }
    }

    setSubmitting(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    try {
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
      let doneBytes = 0;

      for (const file of files) {
        const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
        const safeExt = (ext || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const suffix =
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2, 10);
        const filePath = `invites/${slug}/uploads/${Date.now()}-${suffix}.${safeExt}`;
        const storageRef = ref(storage, filePath);

        const uploadedRef = await new Promise<typeof storageRef>((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, file, {
            contentType: file.type,
            customMetadata: {
              uploaderName: name.trim(),
              inviteSlug: slug,
            },
          });

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              if (!totalBytes) return;
              const totalProgress = ((doneBytes + snapshot.bytesTransferred) / totalBytes) * 100;
              setProgress(Math.min(100, Math.max(0, Math.round(totalProgress))));
            },
            (err) => reject(err),
            () => resolve(uploadTask.snapshot.ref),
          );
        });

        await getDownloadURL(uploadedRef);
        doneBytes += file.size;
      }

      setName('');
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setProgress(100);
      setSuccess(`${files.length}장 업로드되었습니다.`);
    } catch (e: any) {
      console.error('photo upload submit error', e);
      if (e?.code === 'storage/no-default-bucket') {
        setError('Storage 버킷 설정이 비어 있습니다. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET 값을 확인해 주세요.');
      } else if (e?.code === 'storage/unauthorized' || e?.code === 'permission-denied') {
        setError('업로드 권한이 없습니다. Storage/Firestore 규칙을 확인해 주세요.');
      } else {
        setError('업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setSubmitting(false);
      setTimeout(() => setProgress(null), 400);
    }
  };

  return (
    <section className="section anchor photo-upload-section" id="photo-upload">
      <div className="photo-upload-header">
        <p className="photo-upload-icon" aria-hidden="true">📷</p>
        <h2 className="photo-upload-title">사진 업로드</h2>
        <p className="photo-upload-desc">신랑·신부의 행복한 순간을 담아주세요.</p>
      </div>

      {!canUseUpload && (
        <p className="photo-upload-note">Firebase Storage 설정이 없어 업로드 기능이 비활성화되어 있습니다.</p>
      )}

      {canUseUpload && (
        <form className="photo-upload-form" onSubmit={onSubmit}>
          <input
            className="photo-upload-input"
            placeholder="성함"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={20}
            disabled={submitting}
          />
          <div className="photo-upload-file-row">
            <input
              ref={fileInputRef}
              className="photo-upload-file-hidden"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.avif"
              multiple
              onChange={(e) => {
                const picked = Array.from(e.target.files ?? []);
                if (!picked.length) return;
                setFiles((prev) => {
                  const merged = [...prev];
                  for (const file of picked) {
                    const alreadyAdded = merged.some(
                      (f) =>
                        f.name === file.name &&
                        f.size === file.size &&
                        f.lastModified === file.lastModified,
                    );
                    if (!alreadyAdded) merged.push(file);
                  }
                  if (merged.length > MAX_FILES_PER_UPLOAD) {
                    setError(`최대 ${MAX_FILES_PER_UPLOAD}장까지 선택됩니다. 앞 ${MAX_FILES_PER_UPLOAD}장만 적용했어요.`);
                    return merged.slice(0, MAX_FILES_PER_UPLOAD);
                  }
                  setError(null);
                  return merged;
                });
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              disabled={submitting}
            />
            <button
              type="button"
              className="photo-upload-file-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
            >
              파일 선택
            </button>
            <span className={`photo-upload-file-name ${files.length ? 'selected' : ''}`}>
              {files.length
                ? `${files.length}개 파일 선택됨`
                : `선택된 파일 없음 (최대 ${MAX_FILES_PER_UPLOAD}장)`}
            </span>
          </div>
          {files.length > 0 && (
            <div className="photo-upload-selected-wrap">
              <div className="photo-upload-selected-head">
                <span className="photo-upload-selected-count">선택된 파일</span>
              </div>
              <div className="photo-upload-tag-list" aria-live="polite">
                {files.map((file, idx) => (
                  <div className="photo-upload-tag" key={`${file.name}-${file.lastModified}-${idx}`}>
                    <span className="photo-upload-tag-text">
                      {idx + 1}. {file.name}
                    </span>
                    <button
                      type="button"
                      className="photo-upload-tag-remove"
                      onClick={() => {
                        setFiles((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      disabled={submitting}
                      aria-label={`${file.name} 삭제`}
                    >
                      지우기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button className="photo-upload-btn" type="submit" disabled={submitting}>
            {submitting ? '업로드 중...' : '사진 올리기'}
          </button>
          {submitting && (
            <div className="photo-upload-progress" role="status" aria-live="polite">
              <div className="photo-upload-progress-bar">
                <span style={{ width: `${progress ?? 0}%` }} />
              </div>
              <div className="photo-upload-progress-text">{progress ?? 0}%</div>
            </div>
          )}
        </form>
      )}

      {error && <p className="photo-upload-note error">{error}</p>}
      {success && <p className="photo-upload-note success">{success}</p>}
    </section>
  );
}
