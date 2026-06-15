import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '系統架構',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        了解派車系統整體架構、模組職責與 AGV 派車資料流。
        <br />
        <Link to="/docs/architecture/overview">查看架構 →</Link>
      </>
    ),
  },
  {
    title: 'RESTful API',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        完整的 API 端點說明，含請求參數、回應格式與範例。
        <br />
        <Link to="/docs/api/overview">API 文件 →</Link>
      </>
    ),
  },
  {
    title: '更新履歷',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        各版本新增功能、修正項目與破壞性變更說明。
        <br />
        <Link to="/blog">查看更新 →</Link>
      </>
    ),
  },
  {
    title: '常見問題',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        整合、派車與 API 使用上的常見問答與故障排除。
        <br />
        <Link to="/docs/faq">FAQ →</Link>
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
