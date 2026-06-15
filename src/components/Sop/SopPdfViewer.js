import useBaseUrl from '@docusaurus/useBaseUrl';
import sopManifest from '@site/src/data/sop-manifest.json';
import styles from './styles.module.css';

export default function SopPdfViewer({filename}) {
  const item = sopManifest.items.find((entry) => entry.filename === filename);
  const pdfUrl = useBaseUrl(`/sop/${encodeURIComponent(filename)}`);

  if (!item) {
    return (
      <div className={styles.emptyState}>
        <p>找不到 SOP 文件：<code>{filename}</code></p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.viewerToolbar}>
        <div className={styles.viewerMeta}>
          <span>{item.code}</span>
          {item.category ? <span>｜{item.category}</span> : null}
          {item.date ? <span>｜修訂日期：{item.date}</span> : null}
        </div>
        <div className={styles.sopCardActions}>
          <a
            className="button button--outline button--sm"
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer">
            新分頁開啟
          </a>
          <a className="button button--primary button--sm" href={pdfUrl} download={item.filename}>
            下載 PDF
          </a>
        </div>
      </div>

      <iframe className={styles.pdfFrame} src={pdfUrl} title={item.title} />
    </>
  );
}
