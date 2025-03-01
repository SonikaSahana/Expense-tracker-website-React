const fetchMock = (response, shouldFail = false) => {
    global.fetch = jest.fn(() =>
      shouldFail
        ? Promise.reject(new Error("API Error"))
        : Promise.resolve({ json: () => Promise.resolve(response) })
    );
  };
  
  export default fetchMock;
  