export type Stage = "door" | "room" | "letter" | "after";
export type Mode = "night" | "paper";

export type LetterSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  hiddenLine?: string;
};

export type LetterData = {
  date: string;
  recipient: string;
  closing: string;
  signature: string;
  hiddenLine: string;
  sections: LetterSection[];
};

export type ArchivePage = {
  id: string;
  heading: string;
  body: string[];
};

export type ArchiveData = {
  title: string;
  subtitle: string;
  pages: ArchivePage[];
};
