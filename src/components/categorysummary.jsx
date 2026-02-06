useEffect(() => {
  axios.get("/api/report/category-summary")
    .then(res => setData(res.data));
}, []);
