/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  return {
      data: {
        megaModeOn: false,
        session: {
          user: {
            image: {},
            email: "bla",
            name: "blo",
            id: "bab"
          }
        }
      }
  };
}
