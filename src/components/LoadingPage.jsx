

function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <div class="flex-col gap-4 w-full flex items-center justify-center">
          <div
            class="w-20 h-20 border-4 border-transparent text-blue-700 text-4xl animate-spin flex items-center justify-center border-t-blue-700 rounded-full"
          >
            <div
              class="w-16 h-16 border-4 border-transparent text-green-700 text-2xl animate-spin flex items-center justify-center border-t-green-700 rounded-full"
            ></div>
          </div>
        </div>
        <h1 className="mt-1.5">Loading</h1>
      </div>
    </div>
  );
}

export default LoadingPage