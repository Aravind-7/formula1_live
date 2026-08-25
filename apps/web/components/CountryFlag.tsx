import Image from "next/image";
import { flagUrl } from "@/lib/countryFlags";

export function CountryFlag({
  countryCode,
  countryName,
}: {
  countryCode: string;
  countryName: string;
}) {
  const src = flagUrl(countryCode);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={`${countryName} flag`}
      width={20}
      height={14}
      className="inline-block shrink-0 rounded-[2px] object-cover"
    />
  );
}
