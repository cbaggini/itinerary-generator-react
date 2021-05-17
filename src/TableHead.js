const TableHead = ({ profile }) => {
  return (
    <thead>
      <tr>
        <th scope="col">From</th>
        <th scope="col">To</th>
        <th scope="col">Deviation (km)</th>
        <th scope="col">Attraction types</th>
        <th scope="col">Frequency of stops</th>
        <th scope="col">Last updated on</th>
        <th scope="col">See itinerary</th>
        {profile && (
          <>
            <th scope="col">Status</th>
            <th scope="col">Edit trip</th>
            <th scope="col">Delete trip</th>
          </>
        )}
      </tr>
    </thead>
  );
};

export default TableHead;
