
import PrimaryButton from "@/components/primaryButton";
import TextInput from "@/components/textInput";

export default function Login() {
  return (
    <div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-5xl">
          Login
        </h1>

        <form>
    <div className="grid gap-6 mb-6 md:grid-cols-2">
        <TextInput label="Your email" type="email" placeholder="name@holynames-sea.org" required />
        <TextInput label="Password" type="password" placeholder="•••••••••" required />
        
    </div> 
    <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
        </div>
        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
    </div>
    <PrimaryButton text="Login" href="/demo/api-demo" />
    <button type="login" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
</form>
        
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
