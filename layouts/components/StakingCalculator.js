import React, { useState, useEffect } from "react";

const StakingCalculator = () => {
  const [amountStaked, setAmountStaked] = useState("");
  const [amountUnit, setAmountUnit] = useState("dollars"); // Default to dollars
  const [apy, setApy] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("months");
  const [estimatedRewards, setEstimatedRewards] = useState(0);

  useEffect(() => {
    if (amountStaked && apy && duration) {
      const principal = parseFloat(amountStaked) || 0;
      const rate = parseFloat(apy) / 100 || 0;
      let time = parseFloat(duration) || 0;
      if (durationUnit === "months") time = time / 12;

      const rewards = principal * Math.pow(1 + rate / 365, 365 * time);
      setEstimatedRewards(rewards - principal);
    } else {
      setEstimatedRewards(0);
    }
  }, [amountStaked, apy, duration, durationUnit]);

  return (
    <div className="staking-calculator">
      <h2>Staking Calculator</h2>

      <div className="form-group">
        <label htmlFor="amountStaked">Amount Staked: </label>
        <div className="input-group">
          <input
            type="number"
            id="amountStaked"
            value={amountStaked}
            onChange={(e) => setAmountStaked(e.target.value)}
            className="input-field amount-input"
          />
          <select
            value={amountUnit}
            onChange={(e) => setAmountUnit(e.target.value)}
            className="input-field amount-select"
          >
            <option value="dollars">Dollars</option>
            <option value="tokens">Tokens</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="apy">APY (%): </label>
        <input
          type="number"
          id="apy"
          value={apy}
          onChange={(e) => setApy(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration: </label>
        <div className="duration-wrapper">
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input-field duration-input"
          />
          <select
            value={durationUnit}
            onChange={(e) => setDurationUnit(e.target.value)}
            className="input-field duration-select"
          >
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
      </div>

      <div className="result">
        <h3 className={estimatedRewards > 0 ? "profit" : "default"}>
          Estimated Rewards: {amountUnit === "dollars" ? "$" : ""}
          {isNaN(estimatedRewards) ? "0.00" : estimatedRewards.toFixed(2)}{" "}
          {amountUnit === "tokens" ? "Tokens" : ""}
        </h3>
      </div>
    </div>
  );
};

export default StakingCalculator;
