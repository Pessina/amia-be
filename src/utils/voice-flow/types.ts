type TextRequest = {
  type: 'text';
  payload: string;
};

type LaunchRequest = {
  type: 'launch';
};

export type InteractRequest = TextRequest | LaunchRequest;

type TextResponse = {
  type: 'speak';
  payload: {
    message: string;
  };
};

type SpeakResponse = {
  type: 'speak';
  payload: {
    message: {
      type: 'message audio';
      voice: string;
      src: string | null;
    };
  };
};

type ChoiceResponse = {
  type: 'choice';
  payload: {
    choices: Array<{
      name: string;
      intent: string;
      defaultPath: number;
      paths: Array<{
        event: {
          type: string;
        };
      }>;
    }>;
  };
};

type VisualTrace = {
  type: 'visual';
  payload: VisualPayload;
};

type VisualPayload = ImageVisualPayload | APLVisualPayload;

type ImageVisualPayload = {
  visualType: 'image';
  image: string | null;
  device: string | null;
  dimensions: Dimensions | null;
};

type Dimensions = {
  canvasVisibility: 'full' | 'cropped' | 'hidden';
};

type APLVisualPayload = {
  visualType: 'apl';
  title: string;
  aplType: 'JSON SPLASH';
  imageURL: string;
  document: string;
  datasource: string;
  aplCommands: string;
  jsonFileName: string;
};

type TraceStepResponse = {
  type: string;
  payload: string;
  paths: Array<{
    event: {
      name: string;
      defaultPath: number;
    };
  }>;
};

type CarouselTrace = {
  type: 'carousel';
  payload: CarouselPayload;
};

type CarouselPayload = {
  layout: 'carousel';
  cards: Array<CarouselCard>;
};

type CarouselCard = {
  id: string;
  title: string;
  description: CarouselDescription;
  buttons: Array<CarouselButton>;
};

type CarouselDescription = {
  text: string;
  imageUrl: string;
};

type CarouselButton = {
  name: string;
  request: CarouselButtonRequest;
};

type CarouselButtonRequest = {
  type: string;
  payload: CarouselButtonPayload;
};

type CarouselButtonPayload = {
  label: string;
};

export type InteractResponse =
  | TextResponse
  | SpeakResponse
  | ChoiceResponse
  | VisualTrace
  | TraceStepResponse
  | CarouselTrace;
