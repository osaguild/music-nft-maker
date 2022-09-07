import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Content } from '.'

export default {
  title: 'Content',
  component: Content,
} as ComponentMeta<typeof Content>

const Template: ComponentStory<typeof Content> = () => <Content />

export const Default = Template.bind({})
