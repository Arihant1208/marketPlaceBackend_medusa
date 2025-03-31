import {
    SubscriberArgs,
    type SubscriberConfig,
  } from "@medusajs/medusa"
  import { Modules } from "@medusajs/framework/utils"
  
  export default async function resetPasswordTokenHandler({
    event: { data: {
      entity_id: email,
      token,
      actor_type,
    } },
    container,
  }: SubscriberArgs<{ entity_id: string, token: string, actor_type: string }>) {
    const notificationModuleService = container.resolve(
      Modules.NOTIFICATION
    )
    console.log('hi')
  
    const urlPrefix = actor_type === "customer" ? 
      "http://localhost:9000/" : 
      "https://admin.com/app"
  
 const data=   await notificationModuleService.createNotifications({
      to: email,
      channel: "email",
      template: "d-5fe2903a9d2d47dab88d2390baf6580c",
      data: {
        url: `${urlPrefix}/reset-password?token=${token}&email=${email}`,
      },
    })
    console.log(data)
  }
  
  export const config: SubscriberConfig = {
    event: "auth.password_reset",
  }