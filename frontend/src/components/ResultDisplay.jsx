const ResultDisplay = ({ result }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      {result !== null && (
        <h3>Detected Number: {result}</h3>
      )}
    </div>
  );
};

export default ResultDisplay;
