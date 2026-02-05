import React from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
