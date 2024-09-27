/* eslint-disable @next/next/no-img-element */
import { useQuery } from "@apollo/client";
import { GET_USER_INCENTIVES } from "@/graphql/queries/getPaymentData"; // Import the new query

interface IncentiveHistoryProps {
  address: string | null;
  showZar: boolean;
  conversionRate: number | null;
}

const IncentiveHistory = ({ address, showZar, conversionRate  }: IncentiveHistoryProps) => {
  const { data, loading, error } = useQuery(GET_USER_INCENTIVES, {
    variables: { userAddress: address },
  });

  if (loading) return <p>Loading incentive data...</p>;
  if (error) return <p>Error loading incentive data: {error.message}</p>;

  const incentives = data?.incentiveAwardeds || [];

  // Calculate the total incentive amount
  const totalIncentives = incentives.reduce((total: number, incentive: any) => {
    return total + Number(incentive.amount);
  }, 0);

  // Convert total incentives from Wei to cUSD
  const formattedTotalIncentives = (totalIncentives / 1e18).toFixed(2);
  const totalIncentivesZar = conversionRate ? (Number(formattedTotalIncentives) * conversionRate).toFixed(2) : "Loading...";

  return (
    <div className="w-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 bg-opacity-100 p-4 rounded-3xl mb-6 shadow-lg text-white">
      <h3 className="text-lg text-yellow-400 font-semibold mb-4">Commute Coins</h3>
      
      {/* Display total incentives */}
      <div className="flex justify-between mb-4">
        <p className="text-sm">Total Coins earned:</p>
        <p>{showZar ? `${totalIncentivesZar} ZAR` : `${formattedTotalIncentives} cUSD`}</p>
      </div>
    </div>
  );
};

export default IncentiveHistory;