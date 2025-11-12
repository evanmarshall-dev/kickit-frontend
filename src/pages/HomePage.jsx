import { Link } from "react-router-dom";
import {
  Target,
  Zap,
  TrendingUp,
  Users,
  CheckCircle,
  MapPin,
  Trophy,
} from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import styles from "./HomePage.module.scss";

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className={styles.homepage__hero}>
        <div className={styles.homepage__heroIcons}>
          <div className={styles.homepage__floatingIcon}>
            <Target size={48} />
          </div>
          <div className={styles.homepage__floatingIcon}>
            <MapPin size={48} />
          </div>
          <div className={styles.homepage__floatingIcon}>
            <Trophy size={48} />
          </div>
          <div className={styles.homepage__floatingIcon}>
            <Users size={48} />
          </div>
        </div>
        <div className={styles.homepage__heroContainer}>
          <h1 className={styles.homepage__heroTitle}>
            Turn Your Dreams Into{" "}
            <span className={styles.homepage__heroHighlight}>Kicks</span>
          </h1>
          <p className={styles.homepage__heroSubtitle}>
            KickIt helps you track, organize, and complete your bucket list
            kicks. From travel goals to personal milestones, make every moment
            count.
          </p>
          <div className={styles.homepage__heroActions}>
            <Link
              to='/signup'
              className={`${styles.btn} ${styles.btnLight} ${styles.btnLarge}`}>
              Start Your Kick
            </Link>
            <Link
              to='/signin'
              className={`${styles.btn} ${styles.btnOutlineLight} ${styles.btnLarge}`}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.homepage__features}>
        <div className={styles.homepage__featuresContainer}>
          <h2 className={styles.homepage__featuresTitle}>Why Choose KickIt?</h2>
          <div className={styles.homepage__featuresGrid}>
            <div className={styles.homepage__feature}>
              <div className={styles.homepage__featureIcon}>
                <Target />
              </div>
              <h3 className={styles.homepage__featureTitle}>
                Organize Your Goals
              </h3>
              <p className={styles.homepage__featureDescription}>
                Categorize kicks by travel, skills, experiences, and more. Keep
                your bucket list organized and actionable.
              </p>
            </div>

            <div className={styles.homepage__feature}>
              <div className={styles.homepage__featureIcon}>
                <MapPin />
              </div>
              <h3 className={styles.homepage__featureTitle}>
                Track Locations & Dates
              </h3>
              <p className={styles.homepage__featureDescription}>
                Set target dates and locations for your kicks. Turn vague dreams
                into concrete plans.
              </p>
            </div>

            <div className={styles.homepage__feature}>
              <div className={styles.homepage__featureIcon}>
                <Trophy />
              </div>
              <h3 className={styles.homepage__featureTitle}>
                Celebrate Progress
              </h3>
              <p className={styles.homepage__featureDescription}>
                Mark kicks as completed and track your journey with progress
                notes. Celebrate every milestone.
              </p>
            </div>

            <div className={styles.homepage__feature}>
              <div className={styles.homepage__featureIcon}>
                <Users />
              </div>
              <h3 className={styles.homepage__featureTitle}>
                Your Personal Space
              </h3>
              <p className={styles.homepage__featureDescription}>
                Secure, private tracking of your kicks. Only you can see and
                manage your bucket list.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.homepage__cta}>
        <div className={styles.homepage__ctaContainer}>
          <h2 className={styles.homepage__ctaTitle}>
            Ready to Start Your Kick?
          </h2>
          <p className={styles.homepage__ctaSubtitle}>
            Join KickIt today and transform your bucket list into achievable
            goals.
          </p>
          <Link
            to='/signup'
            className={`${styles.btn} ${styles.btnLight} ${styles.btnLarge}`}>
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.homepage__footer}>
        <div className={styles.homepage__footerContainer}>
          <p className={styles.homepage__footerText}>
            Built with ❤️ by Evan Marshall | Full-Stack Software Engineering
            Capstone Project - 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
