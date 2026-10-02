declare module "iyzipay" {
  const Iyzipay: new (options: { apiKey: string; secretKey: string; uri: string }) => unknown
  export default Iyzipay
}
