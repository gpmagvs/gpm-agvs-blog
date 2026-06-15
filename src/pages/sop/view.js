import {useMemo} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import sopManifest from '@site/src/data/sop-manifest.json';
import styles from './styles.module.css';

function useSopItem(id) {
  return useMemo(
    () => sopManifest.items.find((item) => item.id === id) ?? null,
    [id],
  );
}

export default function SopViewPage() {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const item = useSopItem(id);
  const pdfUrl = useBaseUrl(item ? `/sop/${encodeURIComponent(item.filename)}` : '');

  if (!item) {
    return (
      <Layout title="SOP 瀏覽" description="瀏覽 SOP PDF">
        <main className="container margin-vert--lg">
          <div className={styles.emptyState}>
            <Heading as="h1">找不到 SOP 文件</Heading>
            <p>請從 SOP 列表選擇要瀏覽的手順。</p>
            <Link className="button button--primary margin-top--md" to="/sop">
              返回 SOP 列表
            </Link>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title={`${item.title} | SOP`} description={`SOP：${item.title}`}>
      <main className="container margin-vert--lg">
        <div className={styles.viewerToolbar}>
          <div>
            <Heading as="h1" className={styles.viewerTitle}>
              {item.title}
            </Heading>
            <div className={styles.viewerMeta}>
              <span>{item.code}</span>
              {item.category ? <span>｜{item.category}</span> : null}
              {item.date ? <span>｜修訂日期：{item.date}</span> : null}
            </div>
          </div>
          <div className={styles.sopCardActions}>
            <Link className="button button--secondary button--sm" to="/sop">
              返回列表
            </Link>
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

        <iframe
          className={styles.pdfFrame}
          src={pdfUrl}
          title={item.title}
        />
      </main>
    </Layout>
  );
}
