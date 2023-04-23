/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  return {
      data: {
        session: {
          user: {
            image: {},
            email: "bla",
            name: "blo"
          }
        }
      }
  };
}
