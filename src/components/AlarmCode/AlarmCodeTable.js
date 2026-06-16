import React, { useMemo, useState } from 'react';
import styles from './styles.module.css';

function normalizeText(value) {
  return String(value ?? '').toLowerCase();
}

function matchesQuery(entry, query) {
  const codeText = String(entry.code);
  const zhText = normalizeText(entry.descriptionZh);
  const enText = normalizeText(entry.descriptionEn);

  if (codeText === query || codeText.includes(query)) {
    return true;
  }

  return zhText.includes(query) || enText.includes(query);
}

export default function AlarmCodeTable({
  entries,
  zhColumnLabel = '中文描述',
  enColumnLabel = '英文描述',
}) {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredEntries = useMemo(() => {
    if (!normalizedQuery) {
      return entries;
    }

    return entries.filter((entry) => matchesQuery(entry, normalizedQuery));
  }, [entries, normalizedQuery]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <label className={styles.searchField}>
          <span className={styles.searchLabel}>查詢</span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="輸入異常碼、中文或英文描述"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        {query ? (
          <button type="button" className="button button--sm button--outline" onClick={() => setQuery('')}>
            清除
          </button>
        ) : null}
        <span className={styles.resultCount}>
          共 {entries.length} 筆
          {normalizedQuery ? `，符合 ${filteredEntries.length} 筆` : null}
        </span>
      </div>

      {filteredEntries.length === 0 ? (
        <div className={styles.emptyState}>找不到符合「{query}」的異常碼</div>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.codeColumn}>異常碼</th>
                <th>{zhColumnLabel}</th>
                <th>{enColumnLabel}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.code}>
                  <td className={styles.codeColumn}>{entry.code}</td>
                  <td>{entry.descriptionZh || '—'}</td>
                  <td>{entry.descriptionEn || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
