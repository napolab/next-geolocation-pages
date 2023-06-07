import { nextFetch } from "../lib/customFetch";
import { headers } from "next/headers";
import Image from "next/image";
import map from "../public/map.svg";
import countries from "../lib/countries.json";

export const runtime = "edge";

export default async function Home() {
  const headersList = headers();

  const [staticTime, dynamicTime, revalidateTime10, revalidateTime30, revalidateTime60] = await Promise.all([
    nextFetch(
      `https://timeapi.io/api/Time/current/zone?timeZone=Europe/Amsterdam`,
      { cache: "force-cache", next: { tags: ["force-cache", "all"] } }
    ).then((res) => res.json()),
    nextFetch(
      `https://timeapi.io/api/Time/current/zone?timeZone=Europe/Paris`,
      { cache: "no-store", next: { tags: ["no-store", "all"] } }
    ).then((res) => res.json()),
    nextFetch(
      "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Brussels",
      {
        next: {
          // The data will be revalidated every 10 seconds
          revalidate: 10,
          tags: ["revalidate30", "revalidate", "all"],
        },
      }
    ).then((res) => res.json()),
    nextFetch(
      "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Brussels",
      {
        next: {
          // The data will be revalidated every 30 seconds
          revalidate: 30,
          tags: ["revalidate10", "revalidate", "all"],
        },
      }
    ).then((res) => res.json()),
    nextFetch(
      "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Brussels",
      {
        next: {
          // The data will be revalidated every 60 seconds
          revalidate: 60,
          tags: ["revalidate60", "revalidate", "all"],
        },
      }
    ).then((res) => res.json()),
  ]);

  const country = headersList.get("x-vercel-ip-country") || "BE";
  const city = headersList.get("x-vercel-ip-city") || "Brussels";
  const region = headersList.get("x-vercel-ip-country-region") || "BRU";

  const countryInfo = countries.find((x) => x.cca2 === country);

  const currencyCode = Object.keys(countryInfo.currencies)[0];
  const currency = countryInfo.currencies[currencyCode];
  const languages = Object.values(countryInfo.languages).join(", ");
  const currencySymbol = currency.symbol;
  const name = currency.name;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="fixed inset-0 overflow-hidden opacity-75 bg-[#f8fafb]">
        <Image alt="World Map" src={map} fill={true} quality={100} />
      </div>
      <main className="flex flex-col items-center flex-1 px-4 sm:px-20 text-center z-10 pt-8 sm:pt-20">
        <h1 className="text-3xl sm:text-5xl font-bold">
          Geolocation & Data Cache
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-700">
          Show localized content based on headers and show API data cached
        </p>
        <section className="border max-w-xl mx-auto w-full border-gray-300 bg-white rounded-lg shadow-lg mt-16 hover:shadow-2xl transition">
          <div className="p-4 flex justify-center items-between border-b">
            <div className="self-center">
              <Image
                alt={`${country} flag`}
                className="rounded-full"
                src={`https://flagcdn.com/96x72/${country.toLowerCase()}.png`}
                width={32}
                height={32}
                unoptimized
              />
            </div>
            <div className="ml-4 mr-auto text-left">
              <h4 className="font-semibold">{name}</h4>
              <h5 className="text-gray-700">{city}</h5>
            </div>
            <p className="self-center text-gray-700">{country}</p>
          </div>
          <div className="p-4 flex justify-center items-between border-b bg-gray-50">
            <h4 className="font-semibold text-left mr-auto">Languages</h4>
            <div className="self-center">
              <p className="text-gray-700">{languages}</p>
            </div>
          </div>
          <div className="p-4 flex justify-center items-between border-b bg-gray-50">
            <h4 className="font-semibold text-left mr-auto">Currency</h4>
            <p className="text-gray-700">{`${currencyCode} ${currencySymbol}`}</p>
          </div>
          <div className="p-4 flexborder-b bg-gray-50 rounded-b-lg">
            <h4 className="font-semibold text-left">Geolocation Headers</h4>
            <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg mt-4 text-sm leading-6">
              <p>
                <strong>{"x-vercel-ip-city: "}</strong>
                {city}
              </p>
              <p>
                <strong>{"x-vercel-ip-country-region: "}</strong>
                {region}
              </p>
              <p>
                <strong>{"x-vercel-ip-country: "}</strong>
                {country}
              </p>
            </pre>
          </div>
          <div className="p-4 flex justify-center items-between border-b bg-gray-50">
            <h4 className="font-semibold text-left mr-auto">
              Static Time (force-cache)
            </h4>
            <div className="self-center">
              <p className="text-gray-700">{staticTime.dateTime}</p>
            </div>
          </div>
          <div className="p-4 flex justify-center items-between border-b bg-gray-50">
            <h4 className="font-semibold text-left mr-auto">
              Dynamic Time (no-store)
            </h4>
            <div className="self-center">
              <p className="text-gray-700">{dynamicTime.dateTime}</p>
            </div>
          </div>
          <div className="p-4 flex justify-center items-between border-b bg-gray-50">
            <h4 className="font-semibold text-left mr-auto">
              Dynamic Time (revalidate 10sec - tags revalidate10 & revalidate)
            </h4>
            <div className="self-center">
              <p className="text-gray-700">{revalidateTime10.dateTime}</p>
            </div>
          </div>
          <div className="p-4 flex justify-center items-between border-b bg-gray-50">
            <h4 className="font-semibold text-left mr-auto">
              Dynamic Time (revalidate 30sec - tags revalidate30 & revalidate)
            </h4>
            <div className="self-center">
              <p className="text-gray-700">{revalidateTime30.dateTime}</p>
            </div>
          </div>
          <div className="p-4 flex justify-center items-between border-b bg-gray-50">
            <h4 className="font-semibold text-left mr-auto">
              Dynamic Time (revalidate 60sec - tags revalidate60 & revalidate)
            </h4>
            <div className="self-center">
              <p className="text-gray-700">{revalidateTime60.dateTime}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
