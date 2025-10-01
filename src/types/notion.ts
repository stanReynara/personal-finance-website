export interface NotionTitle {
  plain_text: string;
}

export interface NotionProperty {
  title?: NotionTitle[];
  [key: string]: any;
}

export interface NotionItem {
  id: string;
  properties: {
    Name?: NotionProperty;
    [key: string]: any;
  };
}

export interface NotionResponse {
  results: NotionItem[];
  [key: string]: any;
}
