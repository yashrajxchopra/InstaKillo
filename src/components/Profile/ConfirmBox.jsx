export default function ConfirmBox({handleSubmit, setIsConfirmOpen, loading, textToDisplay}) {
    return(
      <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-black w-[200px] h-auto p-4 rounded-lg shadow-md flex flex-col items-center justify-between relative">
          <h3 className="text-white text-center font-medium">{textToDisplay}</h3>
    
          <button
            onClick={() => setIsConfirmOpen(false)}
            className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
    
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold rounded-md px-3 py-1.5 hover:bg-indigo-500 mt-2"
          >
            {loading ? "Processing..." : "Yes"}
          </button>
        </div>
      </div>
    </>
    );
    }
    