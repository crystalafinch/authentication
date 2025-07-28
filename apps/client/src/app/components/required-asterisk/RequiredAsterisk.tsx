function RequiredAsterisk({ showSrOnly = true }) {
  return (
    <>
      <span aria-hidden="true" className="font-medium text-red-700">
        *
      </span>
      {showSrOnly && <span className="sr-only">required</span>}
    </>
  );
}

export default RequiredAsterisk;
