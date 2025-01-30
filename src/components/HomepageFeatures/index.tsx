import Heading from "@theme/Heading";
import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  src: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Precision Agriculture",
    src: require("@site/static/images/precision-agriculture.png").default,

    description: (
      <>
        Precision agriculture uses advanced technologies such as GPS, IoT
        sensors, and data analytics to optimize farming practices. This feature
        allows farmers to monitor soil health, crop conditions, and weather
        patterns in real-time, enabling them to make data-driven decisions.
        Benefits include increased crop yields, efficient use of resources like
        water and fertilizers, and reduced environmental impact.
      </>
    ),
  },
  {
    title: "Smart Farm Management Systems",
    src: require("@site/static/images/smart-farm.png").default,
    description: (
      <>
        This systems integrates digital platforms and software to manage farm
        operations seamlessly. Features often include task scheduling, inventory
        management, financial tracking, and real-time monitoring of livestock or
        crop health. Farmers can access this information through mobile apps or
        web interfaces, streamlining farm activities and improving productivity.
      </>
    ),
  },
  {
    title: "Supply Chain Optimization",
    src: require("@site/static/images/supply-chain.jpg").default,
    description: (
      <>
        Agritech solution enhances the agricultural supply chain by leveraging
        blockchain, AI, and IoT technologies. These tools provide end-to-end
        traceability, ensuring the authenticity and quality of agricultural
        products. Farmers, distributors, and retailers can track products from
        farm to fork, reducing waste, improving logistics, and building consumer
        trust.
      </>
    ),
  },
];

function Feature({ title, src, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} role="img" /> */}
        <img src={src} className={styles.featureSvg} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
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
