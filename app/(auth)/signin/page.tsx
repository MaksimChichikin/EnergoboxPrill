export const metadata = {
  title: 'Авторизация',
  description: 'Page description',
}

import Link from 'next/link'

export default function SignIn() {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Page header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1">Авторизация</h1>
          </div>

          {/* Form */}
          <div className="max-w-sm mx-auto">
            <form>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">Почта</label>
                  <input id="email" type="email" className="form-input w-full text-gray-300" placeholder="Введите вашу почту" required />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">Пароль</label>
                  <input id="password" type="password" className="form-input w-full text-gray-300" placeholder="Введите пароль (не менее 10 символов)" required />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <div className="flex justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-gray-400 ml-2">Запомнить меня</span>
                    </label>
                    <Link href="/reset-password" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Забыли пароль?</Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button className="btn text-white bg-purple-600 hover:bg-purple-700 w-full" >Вход</button>
                </div>
              </div>
            </form>
            <div className="text-gray-400 text-center mt-6">
              У вас нет аакаунта? <Link href="/signup" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Зарегестрируйся</Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
