import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from '../Sop/styles.module.css';

export default function PdfViewer({filename, title, version}) {
  const pdfUrl = useBaseUrl(`/${encodeURIComponent(filename)}`);

  return (
    <>
      <div className={styles.viewerToolbar}>
        <div className={styles.viewerMeta}>
          {version ? <span>版本：{version}</span> : null}
        </div>
        <div className={styles.sopCardActions}>
          <a
            className="button button--outline button--sm"
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer">
            新分頁開啟
          </a>
          <a className="button button--primary button--sm" href={pdfUrl} download={filename}>
            下載 PDF
          </a>
        </div>
      </div>

      <iframe className={styles.pdfFrame} src={pdfUrl} title={title ?? filename} />
    </>
  );
}
