// pages/rab-page.tsx

'use client'; // Убедитесь, что эта строка добавлена первой

import React from 'react';

const UserPage: React.FC = () => {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1">Работник</h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPage;
