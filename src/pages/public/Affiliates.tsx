import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";

const Affiliates = () => {
  return (
    <>
      <PublicHeader />
      <main>
        {/* Banner */}
        <section className="py-20 px-4 bg-[#051B30] text-center mb-16">
          <h1 className="text-white font-semibold text-4xl mb-4">
            PredictBeta Affiliates
          </h1>
          <p className="text-[#E1E7EC] max-w-[600px] mx-auto">
            Your prediction points are not enough! Invite friends to sign up on
            PredictBeta with your referral code and earn points, for FREE!
          </p>
        </section>
        <section className="px-4 md:px-40 mb-20">
          <div className="md:w-2/3">
            {/* Getting Started */}
            <h3 className="text-[#212934] font-semibold text-4xl mb-3">
              Getting Started
            </h3>
            <ul className="px-4 list-disc space-y-2">
              <li>
                <p className="text-[#212934]">
                  To play the PredictBeta league, make sure you already have an
                  account with us. Sign up!
                </p>
              </li>
              <li>
                <p className="text-[#212934]">
                  Share your referral code with friends and family to sign up on
                  PredictBeta. We will provide the referral code for you.
                </p>
              </li>
              <li>
                <p className="text-[#212934]">
                  Each time a friend signs up with your referral code, you earn
                  2 points. Refer a total of 10 friends and earn 20 points.
                </p>
              </li>
              <li>
                <p className="text-[#212934]">
                  When submitting your predictions for a game round, you can
                  trigger your referral points to be included in your results.
                </p>
              </li>
              <li>
                <p className="text-[#212934]">
                  You can ONLY trigger your referral points when you have the
                  maximum number of 20 points.
                </p>
              </li>
              <li>
                <p className="text-[#212934]">
                  The weekly leaderboard will reflect users who added their
                  referral points.
                </p>
              </li>
              <li>
                <p className="text-[#212934]">
                  If you do not use your referral points within a game round, they
                  will be lost.
                </p>
              </li>
              <li>
                <p className="text-[#212934]">
                  You&apos;re now all set for success on PredictBeta!
                </p>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
};

export default Affiliates;
