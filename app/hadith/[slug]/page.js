'use client';

import Link from 'next/link';
import Header from '../../components/header.jsx';
import Footer from '../../components/footer.jsx';
import { useState, useEffect, use } from 'react';

const bookData = {
  'sahih-al-bukhari': { name: 'صحيح البخاري', count: '7,275', reliability: 'صحيح' },
  'sahih-muslim': { name: 'صحيح مسلم', count: '5,033', reliability: 'صحيح' },
  'sunan-al-tirmidhi': { name: 'سنن الترمذي', count: '3,956', reliability: 'متنوع' },
  'sunan-ibn-majah': { name: 'سنن ابن ماجة', count: '4,341', reliability: 'متنوع' },
  'sunan-al-nasai': { name: 'سنن النسائي', count: '5,270', reliability: 'صحيح' },
  'sunan-abi-dawood': { name: 'سنن أبي داود', count: '5,274', reliability: 'متنوع' },
};

export default function HadithBookPage({ params }) {
  const { slug } = use(params);
  const book = bookData[slug];
  const [allHadiths, setAllHadiths] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHadiths, setFilteredHadiths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHadiths() {
      try {
        const response = await fetch(`/api/hadith/${slug}`);
        const data = await response.json();
        setAllHadiths(data);
        setFilteredHadiths(data);
      } catch (error) {
        console.error('Error fetching hadiths:', error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchHadiths();
    }
  }, [slug]);

  // Group hadiths by chapterId
  const chapters = {};
  filteredHadiths.forEach(hadith => {
    if (!chapters[hadith.chapterId]) {
      chapters[hadith.chapterId] = [];
    }
    chapters[hadith.chapterId].push(hadith);
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredHadiths(allHadiths);
    } else {
      // Normalize Arabic text by removing diacritics for better search
      const normalizeArabic = (text) => {
        return text
          .replace(/[\u064B-\u0652]/g, '') // Remove harakat (diacritics)
          .replace(/[\u0670]/g, '') // Remove superscript alif
          .replace(/[\u0640]/g, ''); // Remove tatweel
      };
      const normalizedTerm = normalizeArabic(term);
      const filtered = allHadiths.filter(hadith => {
        const normalizedText = normalizeArabic(hadith.text);
        return normalizedText.includes(normalizedTerm);
      });
      setFilteredHadiths(filtered);
    }
  };

  if (!book) {
    return (
      <main className="min-h-screen bg-white">
        <Header activeTab="الحديث" />
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-800">الكتاب غير موجود</h1>
        </div>
        <Footer />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header activeTab="الحديث" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a4240] mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الأحاديث...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header activeTab="الحديث" />

      {/* Back Button */}
      <div className="bg-[#0a4240] text-white py-6 px-6 md:px-12">
        <Link href="/hadith" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          العودة لصفحة الحديث
        </Link>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a4240] mb-4">{book.name}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            {allHadiths.length} حديث • {book.reliability}
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 px-6 md:px-12 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في الأحاديث..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a4240] focus:border-transparent text-right"
              dir="rtl"
            />
            <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              تم العثور على {filteredHadiths.length} حديث
            </p>
          )}
        </div>
      </section>

      {/* Hadiths */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        {Object.keys(chapters).length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">لا توجد أحاديث مطابقة للبحث.</p>
          </div>
        ) : (
          Object.keys(chapters).map(chapterId => (
            <div key={chapterId} className="mb-12">
              <h2 className="text-2xl font-bold text-[#0a4240] mb-6 border-b-2 border-[#0a4240] pb-2">الباب {chapterId}</h2>
              <div className="space-y-6">
                {chapters[chapterId].map((hadith, index) => (
                  <div key={`${chapterId}-${hadith.id}-${index}`} className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#0a4240]/30 hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0a4240] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{hadith.id}</span>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">الحديث رقم {hadith.id}</span>
                      </div>
                      <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        الباب {chapterId}
                      </div>
                    </div>
                    <div className="relative">
                      <p className="text-gray-800 leading-relaxed text-right text-lg" dir="rtl">{hadith.text}</p>
                      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#0a4240] to-transparent rounded-l-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <Footer />
    </main>
  );
}