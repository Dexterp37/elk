export default defineEventHandler(async (event) => {
  try {
    const { server } = getRouterParams(event)

    const data = await fetch(
      `https://${server}/api/v1/instance/extended_description`,
    ).then(response => response.json())
    return data
  }
  catch (err) {
    console.warn(err)
    return []
  }
})
