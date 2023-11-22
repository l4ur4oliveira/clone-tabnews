function Home() {
  return (
    <div>
      <style global jsx>{`
        body,
        * {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
        }
      `}</style>
      <style jsx>{`
        .box {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        h1 {
          text-align: center;
          padding: 1.6rem;
          border-radius: 1.2rem;
          border: 2px solid #efefef;
          box-shadow: 8px 8px 25px 0px rgba(165, 165, 165, 0.5);
          -webkit-box-shadow: 8px 8px 25px 0px rgba(165, 165, 165, 0.5);
          -moz-box-shadow: 8px 10px 25px 0px rgba(165, 165, 165, 0.5);
        }
      `}</style>
      <div className="box">
        <h1>
          Vai ficar tudo bem!
          <br />
          Amo-te 💕
        </h1>
      </div>
    </div>
  );
}

export default Home;
