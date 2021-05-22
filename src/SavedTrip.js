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
    <article className="trip">
      <h3>
        {allData.dataFrom.features[0].properties.name} to&nbsp;
        {allData.dataTo.features[0].properties.name}
      </h3>
      <p>
        Deviating up to {form.buffer} km and stopping every{" "}
        {parseInt(form.timeInterval) / 3600} hours
      </p>
      <p>Visiting {form.categories.join(", ")} attractions</p>
      <p>Last updated on {new Date(updated).toLocaleDateString()}</p>

      <Link
        to={{
          pathname: "/",
          state: {
            isLoaded_p: true,
            allData_p: allData,
            form_p: form,
            routeData_p: routeData,
            poiDetails1: poiDetails1,
            saved: true,
          },
        }}
      >
        <button className="btn btn-primary">See trip</button>
      </Link>
      {profile && (
        <>
          <p>
            This trip is <strong>{isPublic ? "Public" : "Private"}</strong>
          </p>
          <div>
            <button
              className="btn btn-info"
              type="button"
              onClick={() => togglePrivacy(_id, isPublic)}
            >
              Change privacy
            </button>
          </div>

          <div>
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
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => deleteTrip(_id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
};

export default SavedTrip;
