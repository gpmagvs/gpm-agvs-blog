import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import sopManifest from '@site/src/data/sop-manifest.json';
import styles from './styles.module.css';

function groupByCategory(items) {
  const groups = new Map();

  for (const item of items) {
    if (!groups.has(item.category)) {
      groups.set(item.category, {
        label: item.category,
        order: item.categoryOrder,
        items: [],
      });
    }
    groups.get(item.category).items.push(item);
  }

  return [...groups.values()].sort((a, b) => a.order - b.order);
}

function SopCard({item}) {
  const pdfUrl = useBaseUrl(`/sop/${encodeURIComponent(item.filename)}`);

  return (
    <article className={styles.sopCard}>
      <Heading as="h3" className="margin-bottom--none">
        {item.title}
      </Heading>
      <div className={styles.sopCardMeta}>
        <span>{item.code}</span>
        {item.date ? <span>修訂日期：{item.date}</span> : null}
      </div>
      <div className={styles.sopCardActions}>
        {item.docId ? (
          <Link className="button button--primary button--sm" to={`/docs/${item.docId}`}>
            線上瀏覽
          </Link>
        ) : null}
        <a
          className="button button--secondary button--sm"
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer">
          新分頁開啟
        </a>
        <a
          className="button button--outline button--sm"
          href={pdfUrl}
          download={item.filename}>
          下載 PDF
        </a>
      </div>
    </article>
  );
}

export default function SopList() {
  const groups = groupByCategory(sopManifest.items);

  if (groups.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>目前尚無 SOP 文件。請將 PDF 放入 <code>static/sop/</code> 後重新建置網站。</p>
      </div>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <section key={group.label} className={styles.categoryBlock}>
          <Heading as="h2" className={styles.categoryTitle}>
            {group.label}
          </Heading>
          <div className={styles.sopList}>
            {group.items.map((item) => (
              <SopCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
