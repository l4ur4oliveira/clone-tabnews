function status(req, res) {
  res.status(200).json({ message: "Status endpoint..." });
}

export default status;
