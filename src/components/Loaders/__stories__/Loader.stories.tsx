import { ComponentMeta, ComponentStory } from "@storybook/react";
import * as React from "react";

// @ts-ignore
import Loader from "@/components/loaders/Loader";

export default {
  title: "Components/Loaders/Loader",
  component: Loader,
  argTypes: {
    // override React.ReactNode type with this
    // children: {
    // control: { type: 'text' },
    // },
  },
} as ComponentMeta<typeof Loader>;

const Template: ComponentStory<typeof Loader> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {};
