"use client";

import type { ComponentType } from "react";
import type { AppId } from "./data";
import AboutApp from "./apps/AboutApp";
import AmaApp from "./apps/AmaApp";
import PianoApp from "./apps/PianoApp";
import PodcastApp from "./apps/PodcastApp";
import YapApp from "./apps/YapApp";
import BuildsApp from "./apps/BuildsApp";
import ShareDocsApp from "./apps/ShareDocsApp";
import PicksApp from "./apps/PicksApp";
import TerminalApp from "./apps/TerminalApp";
import SettingsApp from "./apps/SettingsApp";

export const REGISTRY: Record<AppId, ComponentType> = {
  about: AboutApp,
  ama: AmaApp,
  piano: PianoApp,
  podcast: PodcastApp,
  yap: YapApp,
  builds: BuildsApp,
  "share-docs": ShareDocsApp,
  picks: PicksApp,
  terminal: TerminalApp,
  settings: SettingsApp,
};
