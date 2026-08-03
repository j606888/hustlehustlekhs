import Image from 'next/image';
import Link from 'next/link';
import { LINKS } from '@/constants/links'
import { VENUES } from '@/data/venues'

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-gray-300">
      <div className="px-6 py-10 md:max-w-7xl md:mx-auto">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Image src="/logo.svg" alt="HustleHustle KHS" width={340} height={56} className="brightness-0 invert w-auto h-8" />
            {/* TODO: 換成一句話的定位描述 */}
            <p className="text-sm text-gray-400">高雄的 Hustle 社交舞教室</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">快速連結</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/courses" className="hover:text-white transition-colors">課程資訊</Link>
              <Link href="/teachers" className="hover:text-white transition-colors">師資介紹</Link>
              <Link href="/location" className="hover:text-white transition-colors">教室資訊</Link>
              <Link href={LINKS.PRICING} className="hover:text-white transition-colors">課程費用</Link>
            </nav>
          </div>

          {/* Contact：LINKS.LINE 還沒填時不渲染，避免留一個點了沒反應的連結 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">聯絡我們</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a href={LINKS.INSTAGRAM_DM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Image src="/icons/instagram.svg" alt="Instagram" width={20} height={20} />
                Instagram 報名 / 諮詢
              </a>
              {LINKS.LINE && (
                <a href={LINKS.LINE} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Image src="/icons/line.svg" alt="LINE" width={20} height={20} />
                  LINE
                </a>
              )}
            </div>
          </div>

          {/* 上課據點：地址以 src/data/venues.ts 為單一來源，避免站內地址不一致 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">上課據點</h3>
            <div className="flex flex-col gap-3 text-sm">
              {VENUES.map((venue) => (
                <Link
                  key={venue.slug}
                  href="/location"
                  className="flex flex-col gap-0.5 hover:text-white transition-colors"
                >
                  <span className="font-semibold">
                    {venue.city}{venue.district}
                    <span className="ml-1 font-normal text-gray-400">・{venue.shortName}</span>
                  </span>
                  <span className="text-gray-400">{venue.addressFull}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-600 pt-6 text-center text-sm text-gray-500">
          HustleHustle KHS © {new Date().getFullYear()} Copyright
        </div>
      </div>
    </footer>
  );
};

export default Footer;
