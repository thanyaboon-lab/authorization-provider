import mongoose from 'mongoose';
import { ValidationError } from './errors';

export class Database {
  private static instance: Database;

  private constructor() {
    if (Database.instance) {
      throw new ValidationError(
        'Cannot create more thane one instance of DatabaseConnection'
      );
    }

    Database.connect(
      'mongodb://root:example@localhost:27017/oauth?authSource=admin'
    );
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public static connect(uri: string) {
    try {
      mongoose.connect(uri);
      console.log('Successfully connected to the database');
    } catch (error) {
      console.error('Database connection error', error);
      throw error;
    }
  }
}

// Factory Method

//-- Abstract Product --
abstract class Notification {
  abstract send(message: string): string
}

//-- Concrete Product --
class EmailNotification extends Notification {
  send(message: string): string {
    return `Send ${message}`
  }
}
class SMSNotification extends Notification {
  send(message: string): string {
    return `Send ${message}`
  }
}
class PushNotification extends Notification {
  send(message: string): string {
    return `Send ${message}`
  }
}

//-- Creator Class --

class NotificationFactory {
  createNotification (notificationType: string) {
    switch (notificationType) {
      case 'email':
        return new EmailNotification()
      case 'sms':
        return new SMSNotification()
      case 'push':
        return new PushNotification()
      default:
        throw new Error('Error')
    }
  }
}

const factory = new NotificationFactory()

const email = factory.createNotification('email')
email.send('email')

const sms = factory.createNotification('sms')
sms.send('sms')

const push = factory.createNotification('push')
push.send('push')


// Abstract Factory

// -- Abstract Product --
abstract class Button {
  abstract render(): void
}
abstract class CheckBox {
  abstract render(): void
}

// -- Concrete Product --

class DarkButton extends Button {
  render(): void {
      console.log('DarkButton')
  }
}
class LightButton extends Button {
  render(): void {
      console.log('LightButton')
  }
}
class DarkCheckBox extends CheckBox {
  render(): void {
      console.log('DarkCheckBox')
  }
}
class LightCheckBox extends CheckBox {
  render(): void {
      console.log('LightCheckBox')
  }
}

// -- Abstract Factory Interface --

interface IUIElementFactory {
  createButton(): Button
  createCheckBox(): CheckBox
}

// -- Abstract Factory --

abstract class UIElementFactory implements IUIElementFactory {
  abstract createButton(): Button;
  abstract createCheckBox(): Button;
}

// -- Concrete Factory --

class DarkThemeFactory extends UIElementFactory {
  createButton(): Button {
      return new DarkButton()
  }
  createCheckBox(): Button {
      return new DarkCheckBox()
  }
}

class LightThemeFactory extends UIElementFactory {
  createButton(): Button {
      return new LightButton()
  }
  createCheckBox(): Button {
      return new LightCheckBox()
  }
}