import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Thiết kế trực quan",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Giao diện trực quan, dễ thao tác, các mục được phân chia rõ ràng và hợp
        lý.
      </>
    ),
  },
  {
    title: "Kiến thức toàn diện",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        Nội dung phong phú, bám sát chương trình Hóa học THPT, đặc biệt phần
        thực hành.
      </>
    ),
  },
  {
    title: "Nâng cao kỹ năng",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        Giúp học sinh củng cố kiến thức, rèn kỹ năng quan sát và phân tích hiện
        tượng hóa học.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
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
