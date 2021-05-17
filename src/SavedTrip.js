import { Link } from "react-router-dom";

const SavedTrip = ({ allData, form, routeData, updated }) => {
  return (
    <>
      <tr>
        <td>{allData.dataFrom.features[0].properties.name}</td>
        <td>{allData.dataTo.features[0].properties.name}</td>
        <td>{form.buffer} km</td>
        <td>{form.categories.join(", ")}</td>
        <td>{parseInt(form.timeInterval) / 3600} hours</td>
        <td>{new Date(updated).toLocaleDateString()}</td>
        <td>
          <Link
            to={{
              pathname: "/",
              state: {
                isLoaded_p: true,
                allData_p: allData,
                form_p: form,
                routeData_p: routeData,
              },
            }}
          >
            <button>See trip</button>
          </Link>
        </td>
      </tr>
    </>
  );
};

export default SavedTrip;
