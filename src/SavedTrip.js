import { Link } from "react-router-dom";

const SavedTrip = ({
  allData,
  form,
  routeData,
  poiDetails1,
  updated,
  isPublic,
  profile,
  togglePrivacy,
  deleteTrip,
  _id,
}) => {
  const newForm = {
    ...form,
    from: allData.dataFrom.features[0].properties.name,
    to: allData.dataTo.features[0].properties.name,
  };
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
                poiDetails1: poiDetails1,
              },
            }}
          >
            <button className="btn btn-primary">See trip</button>
          </Link>
        </td>
        {profile && (
          <>
            <td className="editPrivacy">
              <p>
                <strong>{isPublic ? "Public" : "Private"}</strong>
              </p>
              <button
                className="btn btn-info"
                type="button"
                onClick={() => togglePrivacy(_id, isPublic)}
              >
                Change
              </button>
            </td>
            <td>
              <Link
                to={{
                  pathname: "/",
                  state: {
                    form_p: newForm,
                  },
                }}
              >
                <button className="btn btn-warning">Edit</button>
              </Link>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteTrip(_id)}
              >
                Delete
              </button>
            </td>
          </>
        )}
      </tr>
    </>
  );
};

export default SavedTrip;
