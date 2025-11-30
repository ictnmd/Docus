import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

const GradeCards = [
  {
    title: "Hoá học 10",
    description: "Kiến thức cơ bản về nguyên tử, phân tử, phản ứng hóa học",
    link: "/docs/danh-muc/hoa-10/tn1",
    icon: "🔬",
    color: "var(--grade-10-color)",
    gradient: "linear-gradient(135deg, #1581BF 0%, #3DB6B1 100%)",
  },
  {
    title: "Hoá học 11",
    description: "Các hợp chất hữu cơ, cấu trúc phân tử và phản ứng",
    link: "/docs/danh-muc/hoa-11/tn1",
    icon: "⚗️",
    color: "var(--grade-11-color)",
    gradient: "linear-gradient(135deg, #3DB6B1 0%, #1581BF 100%)",
  },
  {
    title: "Hoá học 12",
    description: "Hóa học hữu cơ nâng cao, polime và ứng dụng",
    link: "/docs/danh-muc/hoa-12/tn1",
    icon: "🧪",
    color: "var(--grade-12-color)",
    gradient: "linear-gradient(135deg, #F6B1CE 0%, #3DB6B1 100%)",
  },
];

const CategoryCards = [
  {
    title: "Kiến thức chung",
    description: "Bảng tuần hoàn, dụng cụ, nhận biết chất",
    link: "/docs/danh-muc/kien-thuc-chung/bang-tuan-hoan",
    icon: "📚",
    gradient: "linear-gradient(135deg, #F6B1CE 0%, #CCE5CF 100%)",
  },
  {
    title: "Câu hỏi",
    description: "Câu hỏi và bài tập theo từng lớp",
    link: "/docs/danh-muc/cauhoi/cauhoi10/halogen",
    icon: "❓",
    gradient: "linear-gradient(135deg, #1581BF 0%, #3DB6B1 100%)",
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.heroDescription}>
            Nền tảng học tập hóa học trực tuyến với kiến thức toàn diện, 
            thí nghiệm trực quan và tài liệu tham khảo phong phú
          </p>
          <div className={styles.searchPrompt}>
            <span>Nhấn</span>
            <kbd className={styles.kbd}>Ctrl</kbd>
            <span>+</span>
            <kbd className={styles.kbd}>K</kbd>
            <span>để tìm kiếm nhanh</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function GradeCard({ title, description, link, icon, gradient }) {
  return (
    <Link to={link} className={styles.gradeCard}>
      <div 
        className={styles.cardIcon}
        style={{ background: gradient }}
      >
        {icon}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      <div className={styles.cardArrow}>→</div>
    </Link>
  );
}

function CategoryCard({ title, description, link, icon, gradient }) {
  return (
    <Link to={link} className={styles.categoryCard}>
      <div 
        className={styles.categoryIcon}
        style={{ background: gradient }}
      >
        {icon}
      </div>
      <div className={styles.categoryContent}>
        <h3 className={styles.categoryTitle}>{title}</h3>
        <p className={styles.categoryDescription}>{description}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="Nền tảng học tập hóa học trực tuyến với kiến thức toàn diện, thí nghiệm trực quan và tài liệu tham khảo phong phú cho học sinh THPT"
    >
      <HomepageHeader />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Chọn lớp học của bạn
            </Heading>
            <p className={styles.sectionDescription}>
              Khám phá kiến thức hóa học theo từng lớp với các thí nghiệm và bài tập thực hành
            </p>
            <div className={styles.gradeGrid}>
              {GradeCards.map((card, idx) => (
                <GradeCard key={idx} {...card} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Danh mục kiến thức
            </Heading>
            <p className={styles.sectionDescription}>
              Tài liệu tham khảo và câu hỏi củng cố kiến thức
            </p>
            <div className={styles.categoryGrid}>
              {CategoryCards.map((card, idx) => (
                <CategoryCard key={idx} {...card} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className="container">
            <div className={styles.featuresGrid}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎯</div>
                <h3 className={styles.featureTitle}>Kiến thức toàn diện</h3>
                <p className={styles.featureText}>
                  Nội dung phong phú, bám sát chương trình Hóa học THPT, 
                  đặc biệt phần thực hành
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔍</div>
                <h3 className={styles.featureTitle}>Tìm kiếm thông minh</h3>
                <p className={styles.featureText}>
                  Tìm kiếm nhanh chóng các thí nghiệm, hóa chất, dụng cụ 
                  với công nghệ tìm kiếm tiên tiến
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>📖</div>
                <h3 className={styles.featureTitle}>Giao diện trực quan</h3>
                <p className={styles.featureText}>
                  Thiết kế hiện đại, dễ sử dụng, giúp học sinh tập trung 
                  vào nội dung học tập
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
