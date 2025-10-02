"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  account: "Account",
  settings: "Settings",
};

function formatLabel(seg: string) {
  const s = decodeURIComponent(seg);
  return (
    labelMap[s] ?? s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export default function Breadcrumb({
  baseLabel = "Dashboard",
  baseHref = "/dashboard",
}: {
  baseLabel?: string;
  baseHref?: string;
}) {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);
  const baseSeg = baseHref.replace(/^\//, "");
  const startsWithBase = segments[0] === baseSeg;
  const rest = startsWithBase ? segments.slice(1) : segments;

  const buildHref = (i: number) => {
    const prefix = startsWithBase ? baseHref : "";
    const tail = rest.slice(0, i + 1).join("/");
    return (prefix + "/" + tail).replace(/\/+/g, "/");
  };

  return (
    <div aria-label="Breadcrumb" className="mb-2 text-gray-600 text-sm">
      <div className="flex items-center gap-2">
        <div>
          <Link href={baseHref} className="hover:text-amber-500 cursor-pointer">
            {baseLabel}
          </Link>
        </div>

        {rest.map((seg, i) => {
          const href = buildHref(i);
          const isLast = i === rest.length - 1;
          return (
            <div key={href} className="flex items-center gap-2">
              <span className="">/</span>
              {isLast ? (
                <span className="font-medium">{formatLabel(seg)}</span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-amber-500 cursor-pointer"
                >
                  {formatLabel(seg)}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
