import { Request } from "express";
import React from "react";
import { CustomLayoutComponent } from "../../components/CustomLayoutComponent";

export default async function CustomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return <CustomLayoutComponent>{children}</CustomLayoutComponent>;
}
