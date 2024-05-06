import mongoose from 'mongoose';
import { ValidationError } from './errors';

// * Singleton

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

// * Factory Method

//-- Abstract Product --
abstract class Notification {
  abstract send(message: string): string;
}

//-- Concrete Product --
class EmailNotification extends Notification {
  send(message: string): string {
    return `Send ${message}`;
  }
}
class SMSNotification extends Notification {
  send(message: string): string {
    return `Send ${message}`;
  }
}
class PushNotification extends Notification {
  send(message: string): string {
    return `Send ${message}`;
  }
}

//-- Creator Class --

class NotificationFactory {
  createNotification(notificationType: string) {
    switch (notificationType) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      case 'push':
        return new PushNotification();
      default:
        throw new Error('Error');
    }
  }
}

const factory = new NotificationFactory();

const email = factory.createNotification('email');
email.send('email');

const sms = factory.createNotification('sms');
sms.send('sms');

const push = factory.createNotification('push');
push.send('push');

// * Abstract Factory

// -- Abstract Product --
abstract class Button {
  abstract render(): void;
}
abstract class CheckBox {
  abstract render(): void;
}

// -- Concrete Product --

class DarkButton extends Button {
  render(): void {
    console.log('DarkButton');
  }
}
class LightButton extends Button {
  render(): void {
    console.log('LightButton');
  }
}
class DarkCheckBox extends CheckBox {
  render(): void {
    console.log('DarkCheckBox');
  }
}
class LightCheckBox extends CheckBox {
  render(): void {
    console.log('LightCheckBox');
  }
}

// -- Abstract Factory Interface --

interface IUIElementFactory {
  createButton(): Button;
  createCheckBox(): CheckBox;
}

// -- Abstract Factory --

abstract class UIElementFactory implements IUIElementFactory {
  abstract createButton(): Button;
  abstract createCheckBox(): CheckBox;
}

// -- Concrete Factory --

class DarkThemeFactory extends UIElementFactory {
  createButton(): Button {
    return new DarkButton();
  }
  createCheckBox(): CheckBox {
    return new DarkCheckBox();
  }
}

class LightThemeFactory extends UIElementFactory {
  createButton(): Button {
    return new LightButton();
  }
  createCheckBox(): CheckBox {
    return new LightCheckBox();
  }
}

function application(factory: UIElementFactory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckBox();

  button.render();
  checkbox.render();
}

const darkFactory = new DarkThemeFactory();
application(darkFactory);

const lightFactory = new LightThemeFactory();
application(lightFactory);

//----------------------------------------------------------------

// -- Abstract Product --
abstract class UserManagement {
  abstract createUser(): void;
  abstract deleteUser(): void;
}

abstract class ContentManagement {
  abstract createContent(): void;
  abstract deleteContent(): void;
}

// -- Concrete Product --

class EnglishUserManagement extends UserManagement {
  createUser(): void {
    console.log('EnglishUserManagement createUser');
  }
  deleteUser(): void {
    console.log('EnglishUserManagement deleteUser');
  }
}

class EnglishContentManagement extends ContentManagement {
  createContent(): void {
    console.log('EnglishUserManagement createContent');
  }
  deleteContent(): void {
    console.log('EnglishUserManagement deleteContent');
  }
}

class JapanUserManagement extends UserManagement {
  createUser(): void {
    console.log('JapanUserManagement createUser');
  }
  deleteUser(): void {
    console.log('JapanUserManagement deleteUser');
  }
}

class JapanContentManagement extends ContentManagement {
  createContent(): void {
    console.log('JapanUserManagement createContent');
  }
  deleteContent(): void {
    console.log('JapanUserManagement deleteContent');
  }
}

// -- Abstract Factory Interface --

interface ILocaleFactory {
  createUserManagement(): UserManagement;
  createContentManagement(): ContentManagement;
}

// -- Abstract Factory --

abstract class LocaleFactory implements ILocaleFactory {
  abstract createUserManagement(): UserManagement;
  abstract createContentManagement(): ContentManagement;
}

// -- Concrete Factory --

class EnglishLocaleFactory extends LocaleFactory {
  createUserManagement(): UserManagement {
    return new EnglishUserManagement();
  }
  createContentManagement(): ContentManagement {
    return new EnglishContentManagement();
  }
}

class JapanLocaleFactory extends LocaleFactory {
  createUserManagement(): UserManagement {
    return new JapanUserManagement();
  }
  createContentManagement(): ContentManagement {
    return new JapanContentManagement();
  }
}

type Locale = 'en' | 'jp';

function getFactoryForLocale(locale: Locale): LocaleFactory {
  switch (locale) {
    case 'en':
      return new EnglishLocaleFactory();
    case 'jp':
      return new JapanLocaleFactory();
    default:
      throw new Error('Locale not supported');
  }
}

const factoryLocale = getFactoryForLocale('en');

const userManagement = factoryLocale.createUserManagement();
userManagement.createUser();

const contentManagement = factoryLocale.createContentManagement();
contentManagement.createContent();

// * Builder

interface IReport {
  dateRange: { from: string; to: string };
  filter: string[];
  format: string;
}

class Report implements IReport {
  dateRange: { from: string; to: string };
  filter: string[];
  format: string;

  constructor(builder: ReportBuilder) {
    this.dateRange = builder.dateRange;
    this.filter = builder.filter;
    this.format = builder.format;
  }

  generate(): void {
    console.log('generate');
  }
}

class ReportBuilder {
  dateRange: { from: string; to: string } = { from: '', to: '' };
  filter: string[] = [];
  format = '';

  setDateRange(dateRange: { from: string; to: string }): ReportBuilder {
    this.dateRange = dateRange;
    return this;
  }

  setFilters(filter: string[]): ReportBuilder {
    this.filter = filter;
    return this;
  }

  setFormat(format: string): ReportBuilder {
    this.format = format;
    return this;
  }

  build(): Report {
    return new Report(this);
  }
}

const reportBuilder = new ReportBuilder()
reportBuilder.setDateRange({from: '2012-01-01', to: '2012-12-01'}).setFilters(['']).setFormat('').build()
