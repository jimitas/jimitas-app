// pages/404.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "src/components/Layout";
import Link from "next/link";

export default function Custom404() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // サーバーサイドではデフォルトの404を表示
  if (!mounted) {
    return (
      <Layout title="404 - ページが見つかりません">
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-600 mb-6">
              ページが見つかりません
            </h2>
            <p className="text-gray-500 mb-8 max-w-md">
              お探しのページは存在しないか、まだ作成されていません。
            </p>
            <Link 
              href="/" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // クライアントサイドでは動的なページ名を表示
  const pageName = router.asPath 
    ? router.asPath.replace("/", "").replace(/_/g, " ").replace(/-/g, " ")
    : "404";

  return (
    <Layout title={`${pageName} - 開発中`}>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="text-center">
          <div className="mb-6">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
              開発中
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {pageName}
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-md">
            このページは現在開発中です。
            もうしばらくお待ちください。
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ホームに戻る
            </Link>
            
            <div className="text-sm text-gray-400">
              <p>予定リリース: 近日公開</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}