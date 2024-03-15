import classNames from "classnames";

import { ReactNode } from "react";

export type TypographyProps = {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
};

export type TypographyVariant =
  | "headlineH1"
  | "headlineH2"
  | "headlineH3"
  | "headlineH4"
  | "headlineH5"
  | "headlineH6"
  | "bodyXXL"
  | "bodyL"
  | "bodyLSemiBold"
  | "bodyM"
  | "bodyMSemiBold"
  | "bodyS"
  | "bodyXS"
  | "labelM"
  | "labelMSemiBold"
  | "labelS"
  | "labelSSemiBold"
  | "labelXS"
  | "labelXSSemibold";

const Typography = ({ variant, className, children }: TypographyProps) => {
  const elements: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
    headlineH1: "h1",
    headlineH2: "h2",
    headlineH3: "h3",
    headlineH4: "h4",
    headlineH5: "h5",
    headlineH6: "h6",
    bodyXXL: "p",
    bodyL: "p",
    bodyLSemiBold: "p",
    bodyM: "p",
    bodyMSemiBold: "p",
    bodyS: "p",
    bodyXS: "p",
    labelM: "span",
    labelMSemiBold: "span",
    labelS: "span",
    labelSSemiBold: "span",
    labelXS: "span",
    labelXSSemibold: "span"
  };

  const Element = elements[variant];

  return <Element className={classNames(typographySizes[variant], className)}>{children}</Element>;
};

const typographySizes: Record<TypographyVariant, string> = {
  headlineH1: "text-6xl font-bold",
  headlineH2: "text-5xl font-bold",
  headlineH3: "text-4xl font-bold",
  headlineH4: "text-4xl font-semibold",
  headlineH5: "text-3xl font-bold",
  headlineH6: "text-2xl",
  bodyXXL: "text-xl",
  bodyL: "text-lg",
  bodyLSemiBold: "text-lg font-semibold",
  bodyM: "text-base",
  bodyMSemiBold: "text-base font-semibold",
  bodyS: "text-sm",
  bodyXS: "text-xs",
  labelM: "text-base",
  labelMSemiBold: "text-base font-semibold",
  labelS: "text-2xs font-normal",
  labelSSemiBold: "text-sm font-semibold",
  labelXS: "text-3xs",
  labelXSSemibold: "text-3xs font-semibold"
};

export { typographySizes };
export default Typography;
