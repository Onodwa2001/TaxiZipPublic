// /* eslint-disable @next/next/no-img-element */
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { DriverUI } from "@/components/DriverUI";
// import { gql, useQuery } from "@apollo/client";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft, faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";
// import { useWallet } from "@/hooks/useWallet";
// import { useContractData } from "@/hooks/useContractData";
// import WalletInfo from "@/components/WalletInfo";
// import { GET_PAYMENTS_RECEIVED } from "@/graphql/queries/getPaymentData";

// export default function DriverUIPage() {
//   const router = useRouter();
//   const [amount, setAmount] = useState<string>("");
//   const predefinedAmounts = [1, 2, 0.5];
//   const { getUserBalances, userBalances } = useContractData();
//   const [isMounted, setIsMounted] = useState(false);
//   const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
//   const [showZar, setShowZar] = useState(false); 
//   const [conversionRate, setConversionRate] = useState<number | null>(null);

//   const goBack = () => {
//     router.back();
//   };

//   const { data, loading: graphLoading, error } = useQuery(GET_PAYMENTS_RECEIVED, {
//     variables: { address },
//     skip: !address,
//   });

//   useEffect(() => {
//     setIsMounted(true);
//     const fetchUserData = async () => {
//       await getUserAddress();
//       if (address) {
//         await getUserBalances(address);
//         await getCurrentWalletAmount(address);
//         fetchConversionRate();
//       }
//     };
//     fetchUserData();
//   }, [address, getUserAddress, getUserBalances, getCurrentWalletAmount]);

//   const fetchConversionRate = async () => {
//     try {
//       const response = await fetch("https://open.er-api.com/v6/latest/USD");
//       const data = await response.json();
//       const rate = data.rates.ZAR;
//       setConversionRate(rate);
//     } catch (error) {
//       console.error("Error fetching conversion rate:", error);
//     }
//   };

//   const zarBalance = conversionRate
//     ? (Number(currentWalletAmount) * conversionRate).toFixed(2)
//     : "Loading...";

//   return (
//     <div className="flex flex-col items-center bg-gray-900 text-gray-100 min-h-screen px-6 py-8">
//       {/* Back Button */}
//       <div className="w-full flex items-center mb-4">
//         <button
//           onClick={goBack}
//           className="flex items-center text-gray-300 hover:opacity-80 transition"
//         >
//           <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
//           <span className="text-sm font-medium">Back</span>
//         </button>
//       </div>

//       {/* Wallet Info Section */}
//       <WalletInfo
//         address={address}
//         currentWalletAmount={currentWalletAmount}
//         showZar={showZar}
//         zarBalance={zarBalance}
//         setShowZar={setShowZar}
//       />

//       {/* Driver-specific UI */}
//       <div className="w-full bg-gray-800 p-6 rounded-3xl mb-6 shadow-lg">
//         <DriverUI
//           amount={amount}
//           setAmount={setAmount}
//           predefinedAmounts={predefinedAmounts}
//           address={address || ""}
//           conversionRate={conversionRate || 1}
//           showZar={showZar}
//         />
//       </div>

//       {/* Transactions Section */}
//       <div className="w-full bg-gray-800 p-6 rounded-3xl shadow-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="font-bold text-lg text-gray-100">Recent Activity</h3>
//           <span className="text-sm text-gray-400 cursor-pointer hover:underline">
//             See All
//           </span>
//         </div>
//         <div className="space-y-4">
//           {data?.paymentMades.map((transaction: any) => (
//             <div
//               key={transaction?.id}
//               className="flex justify-between items-center bg-yellow-400 p-4 rounded-xl shadow-md hover:bg-gray-600 transition-all"
//             >
//               <div className="flex items-center space-x-4">
//                 <FontAwesomeIcon
//                   icon={faUserCircle}
//                   className="w-12 h-12 text-yellow-900"
//                 />
//                 <div>
//                   <p className="font-semibold text-black">{`${transaction?.payer.substring(0, 5)}...${transaction?.payer.substring(transaction?.payee.length - 5)}`}</p>
//                   <p className="text-sm text-gray-500">{transaction?.date}</p>
//                 </div>
//               </div>
//               <p
//                 className={`font-bold text-xl ${
//                   transaction?.type !== "positive"
//                     ? "text-green-600"
//                     : "text-red-500"
//                 }`}
//               >
//                 {transaction?.type !== "positive" ? "+" : "-"}$
//                 {(Number.parseInt(transaction?.amount) * Math.pow(10, -18)).toFixed(2)}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DriverUI } from "@/components/DriverUI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "@/hooks/useWallet";
import { useContractData } from "@/hooks/useContractData";
import WalletInfo from "@/components/WalletInfo";
import { GET_PAYMENTS_RECEIVED } from "@/graphql/queries/getPaymentData";
import { useQuery } from "@apollo/client";

export default function DriverUIPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const predefinedAmounts = [1, 2, 0.5];
  const { getUserBalances, userBalances } = useContractData();
  const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("wallet"); // Toggle state for the tabs

  const goBack = () => {
    router.back();
  };

  const { data, loading: graphLoading, error } = useQuery(GET_PAYMENTS_RECEIVED, {
    variables: { address },
    skip: !address,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      await getUserAddress();
      if (address) {
        await getUserBalances(address);
        await getCurrentWalletAmount(address);
        fetchConversionRate();
      }
    };
    fetchUserData();
  }, [address, getUserAddress, getUserBalances, getCurrentWalletAmount]);

  const fetchConversionRate = async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();
      const rate = data.rates.ZAR;
      setConversionRate(rate);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
    }
  };

  const zarBalance = conversionRate
    ? (Number(currentWalletAmount) * conversionRate).toFixed(2)
    : "Loading...";

  return (
    <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 bg-gray-100">
      {/* Back Button */}
      <div className="w-full flex items-center mb-6">
        <button
          onClick={goBack}
          className="flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Toggle Tabs */}
      <div className="w-full max-w-md mb-6">
        <div className="flex bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex-1 py-2 text-center rounded-full ${
              activeTab === "wallet" ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2 text-center rounded-full ${
              activeTab === "activity" ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Wallet and DriverUI Section */}
      {activeTab === "wallet" && (
        <>
          <WalletInfo
            address={address}
            currentWalletAmount={currentWalletAmount}
            showZar={showZar}
            zarBalance={zarBalance}
            setShowZar={setShowZar}
          />

          {/* Driver-specific UI */}
          <div className="w-full bg-white p-4 rounded-lg shadow-md mt-4">
            <DriverUI
              amount={amount}
              setAmount={setAmount}
              predefinedAmounts={predefinedAmounts}
              address={address || ""}
              conversionRate={conversionRate || 1}
              showZar={showZar}
            />
          </div>
        </>
      )}

      {/* Activity Section */}
      {activeTab === "activity" && (
        <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
          {graphLoading ? (
            <p className="text-center text-gray-500">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error loading transactions: {error.message}</p>
          ) : (
            <div className="space-y-4">
              {data?.paymentMades.map((transaction: any) => (
                <div
                  key={transaction?.id}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="w-10 h-10 text-blue-500"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {`${transaction?.payer.substring(0, 5)}...${transaction?.payer.substring(transaction?.payee.length - 5)}`}
                      </p>
                      <p className="text-xs text-gray-500">{transaction?.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${transaction?.type === "positive" ? "text-green-600" : "text-red-600"}`}>
                    {transaction?.type === "positive" ? "+" : "-"}$
                    {(Number(transaction?.amount) / 1e18).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
